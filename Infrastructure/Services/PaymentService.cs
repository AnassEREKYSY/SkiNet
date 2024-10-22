using Core.Entities;
using Core.Interfaces;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Infrastructure.Services;

public class PaymentService(IConfiguration config, ICartService cartService, 
    IUnitOfWork unit) : IPaymentService
{
    public async Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string cartId)
    {
        StripeConfiguration.ApiKey = config["StripeSettings:SecretKey"];

        var cart = await cartService.GetCartAsync(cartId);
        if (cart == null) return null;

        var shippingPrice = 0m;

        if (cart.DeliveryMethodId.HasValue)
        {
            var deliveryMethod = await unit.Repository<DeliveryMethod>().GetByIdAsync((int)cart.DeliveryMethodId);
            if (deliveryMethod == null) return null;

            shippingPrice = deliveryMethod.Price;
        }

        foreach (var item in cart.Items)
        {   
            var productItem = await unit.Repository<Core.Entities.Product>().GetByIdAsync(item.ProductId);
            if (productItem == null) return null;

            if (item.Price != productItem.Price)
            {
                item.Price = productItem.Price;
            }
        }

        var service = new PaymentIntentService();
        PaymentIntent? intent = null;

        if (string.IsNullOrEmpty(cart.PaymentIntentId))
        {
            // Create a new PaymentIntent
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100,
                Currency = "usd",
                PaymentMethodTypes = new List<string> { "card" }
            };
            intent = await service.CreateAsync(options);
            cart.PaymentIntentId = intent.Id;
            cart.ClientSecret = intent.ClientSecret;
        }
        else
        {
            // Fetch the existing PaymentIntent to check its status
            intent = await service.GetAsync(cart.PaymentIntentId);

            if (intent.Status == "requires_payment_method" ||
                intent.Status == "requires_confirmation" ||
                intent.Status == "requires_action")
            {
                // Update the PaymentIntent only if it is in an updatable state
                var options = new PaymentIntentUpdateOptions
                {
                    Amount = (long)cart.Items.Sum(x => x.Quantity * (x.Price * 100)) + (long)shippingPrice * 100
                };
                intent = await service.UpdateAsync(cart.PaymentIntentId, options);
            }
            else
            {
                // If the PaymentIntent is already succeeded, consider creating a new PaymentIntent
                // or handle this scenario according to your business logic
                throw new InvalidOperationException("Cannot update a PaymentIntent that has already succeeded.");
            }
        }

        await cartService.SetCartAsync(cart);

        return cart;
    }
}