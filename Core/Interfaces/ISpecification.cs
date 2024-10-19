using System.Linq.Expressions;

namespace Core.Interfaces;

public interface ISpecification<T>
{
    Expression<Func<T,bool>> Criteria {get;}
    Expression<Func<T,object>> OrderBy {get;}
    Expression<Func<T,object>> OrderByDescending {get;}
    List<Expression<Func<T, object>>> Includes {get;}
    List<string> IncludesString{get;}
    bool IsDistinct {get;}
    bool IsPagingEnabled {get;}
    int Skip {get;}
    int Take {get;}
    IQueryable<T> ApplyCriteria(IQueryable<T> query);
}

public interface ISpecification<T, TResult> : ISpecification<T>
{
    Expression<Func<T,TResult>>? Select {get;}
}
