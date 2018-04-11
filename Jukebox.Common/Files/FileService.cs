using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Jukebox.Common.Abstractions.Files;
using Microsoft.Extensions.FileProviders;

namespace Jukebox.Common.Files
{
    public class FileService : IFileService
    {
        public Task<IEnumerable<DirectoryDTO>> GetDirectoryInfoAsync(string path)
        {
            return string.IsNullOrWhiteSpace(path) ? GetDirectoryOverviewAsync() : GetDirectoryContentsAsync(path);
        }

        private Task<IEnumerable<DirectoryDTO>> GetDirectoryOverviewAsync()
        {
            return Task.Run(() =>
                            {
                                var directories = new List<DirectoryDTO>();

                                if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
                                {
                                    var drives = DriveInfo.GetDrives();

                                    directories.AddRange(drives.Where(x => x.IsReady
                                                                           && (x.DriveType == DriveType.Fixed
                                                                               || x.DriveType == DriveType.Network))
                                                               .Select(driveInfo => new DirectoryDTO
                                                                                    {
                                                                                        DirectoryFullPath = driveInfo.Name,
                                                                                        DirectoryName     = driveInfo.Name + driveInfo.VolumeLabel,
                                                                                        Type              = driveInfo.DriveType == DriveType.Fixed ? DirectoryTypes.DriveOrRoot : DirectoryTypes.Network
                                                                                    }));

                                    var envs = Environment.ExpandEnvironmentVariables("%HOMEDRIVE%%HOMEPATH%");
                                    
                                    directories.Add(new DirectoryDTO
                                                    {
                                                        DirectoryFullPath = envs,
                                                        DirectoryName = envs.Split('\\').Last(),
                                                        Type = DirectoryTypes.Home
                                                    });
                                }

                                if (RuntimeInformation.IsOSPlatform(OSPlatform.Linux))
                                {
                                    var drives = DriveInfo.GetDrives();

                                    directories.AddRange(drives.Where(x => x.IsReady
                                                                           && x.DriveType == DriveType.Network)
                                                               .Select(driveInfo => new DirectoryDTO
                                                                                    {
                                                                                        DirectoryFullPath = driveInfo.Name,
                                                                                        DirectoryName     = driveInfo.VolumeLabel.Split('/').Last(),
                                                                                        Type = DirectoryTypes.Network
                                                                                    }));
                                    
                                    var envs = Environment.GetEnvironmentVariable("HOME");
                                    
                                    directories.Add(new DirectoryDTO
                                    {
                                        DirectoryFullPath = envs,
                                        DirectoryName = envs.Split('/').Last(),
                                        Type = DirectoryTypes.Home
                                    });
                                    
                                    directories.Add(new DirectoryDTO
                                                    {
                                                        DirectoryFullPath = "/",
                                                        DirectoryName = "Root",
                                                        Type = DirectoryTypes.DriveOrRoot
                                                    });
                                }

                                return (IEnumerable<DirectoryDTO>) directories;
                            });
        }

        private Task<IEnumerable<DirectoryDTO>> GetDirectoryContentsAsync(string path)
        {
            return Task.Run(() => new PhysicalFileProvider(path).GetDirectoryContents("")
                                                                .Where(x => x.IsDirectory)
                                                                .Select(x => new DirectoryDTO
                                                                             {
                                                                                 DirectoryFullPath = x.PhysicalPath,
                                                                                 DirectoryName     = x.Name
                                                                             }));
        }
        
    }
    
    
}