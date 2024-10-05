using System;
using API.DTOs;
using Core.Entities;

namespace API.Extensions;

public static class AdressMappingExtensions
{
    public static AdressDto? ToDto(this Adresse? adresse){
        if(adresse == null) return null;
        return new AdressDto {
            Line1= adresse.Line1,
            Line2= adresse.Line2,
            City= adresse.City,
            State= adresse.State,
            Country= adresse.Country,
            PostalCode= adresse.PostalCode,
        };
    }

    public static Adresse ToEntity(this AdressDto adressedto){
        if(adressedto == null) throw new ArgumentNullException(nameof(adressedto));
        return new Adresse {
            Line1= adressedto.Line1,
            Line2= adressedto.Line2,
            City= adressedto.City,
            State= adressedto.State,
            Country= adressedto.Country,
            PostalCode= adressedto.PostalCode,
        };
    }

    public static void UpdateFromDto(this Adresse adresse ,AdressDto adressedto){
        if(adressedto == null) throw new ArgumentNullException(nameof(adressedto));
        if(adresse == null) throw new ArgumentNullException(nameof(adresse));
        
        adresse.Line1= adressedto.Line1;
        adresse.Line2= adressedto.Line2;
        adresse.City= adressedto.City;
        adresse.State= adressedto.State;
        adresse.Country= adressedto.Country;
        adresse.PostalCode= adressedto.PostalCode;
    }
}
