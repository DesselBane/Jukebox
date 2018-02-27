using System.Net;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;

namespace Jukebox.Controllers
{
    [Route("api/[controller]")]
    public class SongController : Controller
    {
        private readonly DataContext      _dataContext;
        private readonly IIndexingService _indexingService;

        public SongController(DataContext dataContext, IIndexingService indexingService)
        {
            _dataContext     = dataContext;
            _indexingService = indexingService;
        }

        [HttpPost("index")]
        [SwaggerResponse(HttpStatusCode.OK, typeof(void), Description                = "Indexing Worked")]
        [SwaggerResponse(208, typeof(ExceptionDTO), Description                      = SongErrorCodes.INDEX_OPERATION_ALREADY_RUNNING + "\nIndexing operation already running")]
        [SwaggerResponse(HttpStatusCode.Forbidden, typeof(ExceptionDTO), Description = SongErrorCodes.NO_PERMISSION_TO_START_INDEXING + "\nUser donst have permission")]
        public Task StartIndexing() => _indexingService.IndexSongsAsync();
    }
}