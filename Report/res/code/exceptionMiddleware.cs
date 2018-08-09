public async Task Invoke(HttpContext context)
{
    try
    {
        await _next(context);
    } catch (InvalidRestOperationException invalidRestOperationException)
    {
        context.Response.StatusCode = invalidRestOperationException.ResponseCode;
        await context.Response.WriteAsync(JsonConvert.SerializeObject(new ExceptionDTO(invalidRestOperationException)));
    }
}
