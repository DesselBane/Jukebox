using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.Files;
using Jukebox.Common.Abstractions.Interception;

namespace Jukebox.Common.Files
{
    public class FileServiceInterceptor: InterceptingMappingBase, IFileService
    {
        private readonly FileValidator _fileValidator;

        public FileServiceInterceptor(FileValidator fileValidator)
        {
            _fileValidator = fileValidator;
            
            BuildUp(new Dictionary<string, Action<IInvocation>>
                    {
                        {
                            nameof(GetDirectoryInfoAsync),
                            x => GetDirectoryInfoAsync((string) x.Arguments[0])
                        }
                    });
        }
        
        public Task<IEnumerable<DirectoryDTO>> GetDirectoryInfoAsync(string path)
        {
            if (!string.IsNullOrWhiteSpace(path))
                _fileValidator.ValidateFilePath(path);
            
            return null;
        }
    }
}