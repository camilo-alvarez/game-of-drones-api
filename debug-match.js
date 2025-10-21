// Script de debug para verificar el estado de los matches
const mongoose = require('mongoose');

async function debugMatch() {
  try {
    await mongoose.connect('mongodb://localhost:27017/game-of-drones');
    console.log('Connected to MongoDB');

    const Match = mongoose.model('Match', new mongoose.Schema({}, { strict: false }));
    
    const matches = await Match.find({}).lean();
    
    console.log('\n=== MATCHES IN DATABASE ===\n');
    matches.forEach((match, index) => {
      console.log(`Match ${index + 1}:`);
      console.log(`  ID: ${match._id}`);
      console.log(`  Status: ${match.status}`);
      console.log(`  Current Round: ${match.currentRound}`);
      console.log(`  Score: Player1=${match.score.player1}, Player2=${match.score.player2}`);
      console.log(`  Rounds Count: ${match.rounds.length}`);
      
      match.rounds.forEach((round, rIndex) => {
        console.log(`    Round ${round.roundNumber}:`);
        console.log(`      Player1 Move: ${round.moves.player1 ? round.moves.player1.move : 'NOT SET'}`);
        console.log(`      Player2 Move: ${round.moves.player2 ? round.moves.player2.move : 'NOT SET'}`);
        console.log(`      Winner: ${round.winner || 'NOT SET'}`);
        console.log(`      Result: ${round.result || 'NOT SET'}`);
      });
      console.log('');
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

debugMatch();
