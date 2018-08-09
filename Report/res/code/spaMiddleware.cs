public async Task Invoke(HttpContext context)
{
    if (!_options.SpecialRoutes.Any(x => context.Request.Path.StartsWithSegments(x))
        && !Path.HasExtension(context.Request.Path.Value))
    {
        context.Response.StatusCode = (int) HttpStatusCode.OK;
        await context.Response.WriteAsync(File.ReadAllText(_options.PathToIndex));
    }
    else
    {
        await _next(context);
    }
}
