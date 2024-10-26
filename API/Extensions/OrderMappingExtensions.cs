using System;
using API.DTOs;
using Core.Entities.OrderAggregate;

namespace API.Extensions;

public static class OrderMappingExtensions
{
    public static OrderDto ToDto(this Order order){
        return new OrderDto
        {
            Id=order.Id,
            BuyerEmail=order.BuyerEmail,
            OrderDate=order.OrderDate,
            ShippingAddress=order.ShippingAddress,
            PaymentSummary=order.PaymentSummary,
            DeliveryMethod=order.DeliveryMethod.Description,
            ShippingPrice=order.DeliveryMethod.Price,
            OrderItems=order.OrderItems.Select(x=> x.ToDto()).ToList(),
            Subtotal=order.Subtotal,
            Status=order.Status.ToString(),
            PaymentIntentId=order.PaymentIntentId,
            Discount=order.Discount,
            Total=order.GetTotal()
        };
    }

    public static OrderItemDto ToDto(this OrderItem order){
        return new OrderItemDto
        {
            ProductId=order.ItemOrdered.ProductId,
            ProductName=order.ItemOrdered.ProductName,
            PictureUrl=order.ItemOrdered.PictureUrl,
            Price=order.Price,
            Quantity=order.Quantity,
        };
    }
}
