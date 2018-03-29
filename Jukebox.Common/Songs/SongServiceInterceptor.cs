using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Castle.DynamicProxy;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.Interception;
using Jukebox.Common.Abstractions.Songs;
using Microsoft.AspNetCore.Mvc;

namespace Jukebox.Common.Songs
{
    public class SongServiceInterceptor : InterceptingMappingBase, ISongService
    {
        private readonly SongValidator _songValidator;

        public SongServiceInterceptor(SongValidator songValidator)
        {
            _songValidator = songValidator;
            
            BuildUp(new Dictionary<string, Action<IInvocation>>
                    {
                        {
                            nameof(SearchForSongAsync),
                            x => SearchForSongAsync((string) x.Arguments[0])
                        },
                        {
                            nameof(GetSongById),
                            x => GetSongById((int) x.Arguments[0])
                        }
                    });
        }
        
        public Task<IEnumerable<Song>> SearchForSongAsync(string searchTerm)
        {
            //TODO add searchTerm verifikation
            
            return null;
        }

        public Task<IActionResult> GetSongById(int songId)
        {
            _songValidator.ValidateSongExists(songId);

            return null;
        }

        public Task<IEnumerable<Artist>> GetArtistsAsync()
        {
            return null;
        }

        public Task<IEnumerable<Album>> GetAlbumsAsync()
        {
            return null;
        }
    }
}