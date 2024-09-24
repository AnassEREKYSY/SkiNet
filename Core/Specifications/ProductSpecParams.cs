
namespace Core.Specifications;

public class ProductSpecParams
{
    private List<string> _brands =[];
    public List<string> Brands
    {
        get =>_brands;
        set 
        { 
            _brands= value.SelectMany(x=>x.Split(',',
            StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }


    private List<string> _types =[];
    public List<string> Types
    {
        get =>_types;
        set 
        { 
            _types= value.SelectMany(x=>x.Split(',',
            StringSplitOptions.RemoveEmptyEntries)).ToList();
        }
    }

    public string? Sort { get; set; }
    
}
