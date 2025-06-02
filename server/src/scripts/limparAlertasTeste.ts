import { limparAlertasTeste } from '../services/alertaIA.service';

async function main() {
  try {
    await limparAlertasTeste();
    console.log('Alertas de teste removidos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao remover alertas de teste:', error);
    process.exit(1);
  }
}

main(); 