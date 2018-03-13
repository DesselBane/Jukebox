using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ExceptionMiddleware;
using Jukebox.Common.Abstractions.DataModel;
using Jukebox.Common.Abstractions.ErrorCodes;
using Jukebox.Common.Abstractions.Options;
using Jukebox.Common.Abstractions.Players;
using Jukebox.Common.Extensions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Org.BouncyCastle.Asn1.X9;


namespace Jukebox.Common.Players
{
    public class PlayerService : IPlayerService
    {
        private readonly DataContext      _dataContext;
        private readonly WebsocketOptions _websocketOptions;
        private readonly Dictionary<int,(Player player,WebSocket socket)> _activePlayers = new Dictionary<int, (Player player, WebSocket socket)>();


        public PlayerService(DataContext dataContext, IOptions<WebsocketOptions> websocketOptions)
        {
            _dataContext      = dataContext;
            _websocketOptions = websocketOptions.Value;
        }

        public Task<IEnumerable<Player>> GetAllPlayersAsync() => Task.FromResult(_activePlayers.Values.Select(x => x.player).ToList() as IEnumerable<Player>);

        public Task<Player> GetPlayerByIdAsync(int playerId)
        {
            if (_activePlayers.ContainsKey(playerId))
                return Task.FromResult(_activePlayers[playerId].player);
            throw new NotFoundException(playerId,nameof(Player),Guid.Parse(PlayerErrorCodes.PLAYER_NOT_FOUND));
        }

        public async Task CreateSocketPlayerAsync(WebSocket socket)
        {

        }

        
        /*public async Task CreateSocketPlayerAsyncOLD(WebSocket socket, Guid playerId)
        {
            var dbPlayer = await _dataContext.Players.FirstOrDefaultAsync(x => x.AccessGuid == playerId);
            dbPlayer.AccessGuid = null;
            await _dataContext.SaveChangesAsync();

            var cancelToken = new CancellationToken();
            var waitForCloseTask = CreateWaitForCloseTask(socket,cancelToken);

            //_activePlayers.Add(dbPlayer, (socket,waitForCloseTask,cancelToken, new object()));
            var data = Encoding.ASCII.GetBytes("Hello there web player");
            await socket.SendAsync(new ArraySegment<byte>(data, 0, data.Length), WebSocketMessageType.Text, true, CancellationToken.None);
            
            await waitForCloseTask;

            _dataContext.Players.Remove(dbPlayer);
            await _dataContext.SaveChangesAsync();
        }

        private async Task CreateWaitForCloseTask(WebSocket socket, CancellationToken token)
        {
            var buffer = new byte[_websocketOptions.BufferSize];

            while (true)
            {
                try
                {
                    var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer, 0, buffer.Length), token);

                    if (!result.CloseStatus.HasValue) continue;

                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                    break;

                } catch (TaskCanceledException canceledException)
                {
                    Console.WriteLine(canceledException.ToJsonString());
                    await socket.CloseAsync(WebSocketCloseStatus.Empty, "", CancellationToken.None);
                    break;
                } catch (Exception ex)
                {
                    Console.WriteLine(ex.ToJsonString());
                    throw;
                }
            }
        }*/
    }
}