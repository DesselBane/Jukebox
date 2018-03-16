using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net.WebSockets;
using Jukebox.Common.Abstractions.DataModel;

namespace Jukebox.Data.InMemory
{
    public class PlayerRepository : IPlayerRepository
    {
        private static int _idCounter;
        private static readonly object ID_COUNTER_SYNC_HANDLE = new object();
        private static readonly object DATA_STORE_SYNC_HANDLE = new object();
        private readonly IQueryable<(Player player, WebSocket socket)> _dataQueryable;
        private readonly List<(Player player, WebSocket socket)> _dataStore = new List<(Player player, WebSocket socket)>();

        public PlayerRepository()
        {
            _dataQueryable = _dataStore.AsQueryable();
        }

        public IEnumerator<(Player player, WebSocket socket)> GetEnumerator()
        {
            return _dataQueryable.GetEnumerator();
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        public Type ElementType => _dataQueryable.ElementType;
        public Expression Expression => _dataQueryable.Expression;
        public IQueryProvider Provider => _dataQueryable.Provider;


        public void Add((Player player, WebSocket socket) item)
        {
            if (item.player.Id == 0)
                lock (ID_COUNTER_SYNC_HANDLE)
                {
                    item.player.Id = _idCounter;
                    _idCounter++;
                }

            lock (DATA_STORE_SYNC_HANDLE)
            {
                _dataStore.Add(item);
            }
        }

        public void Clear()
        {
            lock (DATA_STORE_SYNC_HANDLE)
            {
                _dataStore.Clear();
            }
        }

        public bool Contains((Player player, WebSocket socket) item)
        {
            return _dataStore.Contains(item);
        }

        public void CopyTo((Player player, WebSocket socket)[] array, int arrayIndex)
        {
            _dataStore.CopyTo(array, arrayIndex);
        }

        public bool Remove((Player player, WebSocket socket) item)
        {
            lock (DATA_STORE_SYNC_HANDLE)
            {
                return _dataStore.Remove(item);
            }
        }

        public int Count => _dataStore.Count;
        public bool IsReadOnly => false;

        public int IndexOf((Player player, WebSocket socket) item)
        {
            return _dataStore.IndexOf(item);
        }

        public void Insert(int index, (Player player, WebSocket socket) item)
        {
            lock (DATA_STORE_SYNC_HANDLE)
            {
                _dataStore.Insert(index, item);
            }
        }

        public void RemoveAt(int index)
        {
            lock (DATA_STORE_SYNC_HANDLE)
            {
                _dataStore.RemoveAt(index);
            }
        }

        public (Player player, WebSocket socket) this[int index]
        {
            get => _dataStore[index];
            set
            {
                lock (DATA_STORE_SYNC_HANDLE)
                {
                    _dataStore[index] = value;
                }
            }
        }

        public void RemoveByPlayerId(int playerId)
        {
            Remove(_dataStore.FirstOrDefault(x => x.player.Id == playerId));
        }

        
    }
}