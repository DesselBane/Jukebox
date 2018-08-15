private async Task HandlePlayerOwnerWebsocket(Player    player, WebSocket socket) {
    try
    {
        while (true)
        {
            var buffer = new byte[_websocketOptions.BufferSize];
            var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

            if (result.CloseStatus.HasValue)
            {
                await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                throw new Exception("Trigger catch block");
            }

            HandlePlayerMessage(Encoding.ASCII.GetString(buffer), player.Id);
        }
    } catch
    {
        _playerRepository.RemoveByPlayerId(player.Id);
    }

}
