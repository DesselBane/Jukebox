using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.Interception;
using Jukebox.Common.Abstractions.Songs;

namespace Jukebox.Common.Songs
{
    public class IndexingServiceInterceptor : InterceptingMappingBase, IIndexingService
    {
        private readonly IndexingValidator _indexingValidator;

        public IndexingServiceInterceptor(IndexingValidator indexingValidator)
        {
            _indexingValidator = indexingValidator;


            BuildUp(new Dictionary<string, Action<IInvocation>>
                    {
                        {
                            nameof(IndexSongsAsync),
                            x => IndexSongsAsync()
                        }
                    });
        }

        public Task IndexSongsAsync()
        {
            _indexingValidator.HasPermissionToStartIndexing();
            
            return null;
        }
    }
}