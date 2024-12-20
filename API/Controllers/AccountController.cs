using System.Security.Claims;
using API.DTOs;
using API.Extensions;
using Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController(SignInManager<AppUser> signInManager) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto){
            var user =new AppUser
            {
                FirstName= registerDto.FirstName,
                LastName= registerDto.LastName,
                Email= registerDto.Email,
                UserName= registerDto.Email
            };

            var result = await signInManager.UserManager.CreateAsync(user,registerDto.Password);
            if(!result.Succeeded){
                foreach(var error in result.Errors){
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            } 
            return Ok();
        }

        [Authorize]
        [HttpPost("logout")]
        public async Task<ActionResult> Logout(){
            await signInManager.SignOutAsync();
            return NoContent();
        }

        [HttpGet("user-info")]
        public async Task<ActionResult> GetUserInfo(){
            if(User.Identity?.IsAuthenticated == false) return NoContent();

            var user = await signInManager.UserManager.GetUserByEmailWithAdress(User);

            return Ok( new {
                user.FirstName,
                user.LastName,
                user.Email,
                Adresse = user.Adresse?.ToDto(),
                Roles= User.FindFirstValue(ClaimTypes.Role)
            });
        }

        [HttpGet("auth-status")]
        public ActionResult GetAuthState(){
            return Ok(new {IsAuthenticated = User.Identity?.IsAuthenticated ?? false});
        }

        [Authorize]
        [HttpPost("address")]
        public async Task<ActionResult<Adresse>> CreateOrUpdateAdress(AdressDto adressDto){
            var user = await signInManager.UserManager.GetUserByEmailWithAdress(User);
            if(user.Adresse == null){
                user.Adresse = adressDto.ToEntity();
            }
            else{
                user.Adresse.UpdateFromDto(adressDto);
            }

            var result = await signInManager.UserManager.UpdateAsync(user);
            if(!result.Succeeded) return BadRequest("Problem updating user addresse");
            return Ok(user.Adresse.ToDto());
        }
    }
}
