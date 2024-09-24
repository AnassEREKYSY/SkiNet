using System;
using API.RequestHelpers;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController(IGenericRepository<Product> repo) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<Product>>> GetProducts([FromQuery]ProductSpecParams specParams){
        var spec = new ProductSpecification(specParams);
        var products = await repo.ListAsync(spec);
        var count = await repo.CountAsync(spec);

        var pagination = new Pagination<Product>(specParams.PageIndex , specParams.PageSize , count , products);
        return  Ok(pagination);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id){
        var product = await repo.GetByIdAsync(id);
        if(product == null) return NotFound();
        return product;
    }

    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(Product product){
        repo.Add(product);
        if(await repo.SaveAllAsync()){
            return CreatedAtAction("GetProduct", new {id=product.Id},product);
        }
        return BadRequest("Problem Creating product");
    }

    [HttpPut]
    public async Task<ActionResult> UpdateProduct(int id ,Product product){

        if(product.Id!=id || !ProductExists(id)){
            return BadRequest("Cannot Update the product");
        }

        repo.Update(product);
        if(await repo.SaveAllAsync()){
            return NoContent();
        }
        return BadRequest("Problem Updating product");
    }

    [HttpDelete]
    public async Task<ActionResult> DeleteProduct(int id){

        var product=await repo.GetByIdAsync(id);

        if(product == null)return NotFound();

        repo.Remove(product);
        if(await repo.SaveAllAsync()){
            return NoContent();
        }
        return BadRequest("Problem Deleting product");
    }
    
    [HttpGet("brands")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetBrands(int id){
        var spec = new BrandListSpecification();
        return Ok(await repo.ListAsync(spec));
    }

    [HttpGet("types")]
    public async Task<ActionResult<IReadOnlyList<string>>> GetTypes(int id){
        var spec = new TypeListSpecification();
        return Ok(await repo.ListAsync(spec));
    }

    private bool ProductExists(int id){
        return repo.Exists(id);
    }
}
