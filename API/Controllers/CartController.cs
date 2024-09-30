using Core.Entities;
using Core.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController(ICartService cartService) : BaseApiController
    {

        [HttpGet]
        public async Task<ActionResult<ShoppingCart>> GetCartById(string id){
            var cart= await cartService.GetCartAsync(id);
            return Ok(cart ?? new ShoppingCart{Id=id});
        }

        [HttpPost]
        public async Task<ActionResult<ShoppingCart>> UpdateCart(ShoppingCart cart){
            var updatedCart= await cartService.SetCartAsync(cart);
            if(updatedCart == null) return BadRequest("Probleme with update");
            return updatedCart;
        }

        [HttpDelete]
        public async Task<ActionResult> DeleteCart(string id){
            var deletedCart= await cartService.DeleteCartAsync(id);
            if(!deletedCart) return BadRequest("Probleme deleting cart");
            return Ok() ;
        }
    }
}
