using System;
using System.IO;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.ErrorCodes;


namespace Jukebox.Common.Files
{
    public class FileValidator
    {
        public void ValidateFilePath(string path)
        {
            if(!Directory.Exists(path))
                throw new NotFoundException(path,"Directory", Guid.Parse(FileErrorCodes.DIRECTORY_NOT_FOUND));
        }
    }
}