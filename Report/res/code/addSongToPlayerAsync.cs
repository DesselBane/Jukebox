public Task AddSongToPlayerAsync(int playerId, int songId){
    _playerValidator.ValidatePlayerExists(playerId);
    _songValidator.ValidateSongExists(songId);
    return null;
}
