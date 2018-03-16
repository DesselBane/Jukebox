using System.Collections.Generic;
using System.Linq;
using System.Net.WebSockets;

namespace Jukebox.Common.Abstractions.DataModel
{
    public interface IPlayerRepository : IQueryable<(Player player, WebSocket socket)>, IList<(Player player, WebSocket socket)>
    {
        void RemoveByPlayerId(int playerId);
    }
}