using System;
using System.ComponentModel.DataAnnotations;
using Core.Entities.OrderAggregate;

namespace API.DTOs;

public class CreateOrderDto
{
    [Required]
    public string CartId { get; set; } = string.Empty;
    [Required]
    public int DeliveryMethodId { get; set; }
    [Required]
    public ShippingAddress shippingAddress { get; set; } = null!;
    [Required]
    public PaymentSummary paymentSummary { get; set; }= null!;

}
