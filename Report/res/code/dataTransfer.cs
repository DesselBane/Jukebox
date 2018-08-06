[HttpPost("{playerId}/executeCommand")]
public virtual Task ExecutePlayerCommand([FromBody] PlayerCommand cmd |\label{line:dataT_body}|
                                           , int playerId
                                           , [FromQuery] string playerName) |\label{line:dataT_query}|
