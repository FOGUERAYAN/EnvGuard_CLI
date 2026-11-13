import { execa } from 'execa';

export default async function globalSetup(): Promise<void> {
  console.log('\n Phase F : Build du binaire avant les tests E2E...');
  try {
    await execa('npm', ['run', 'build']);
    console.log('Build réussi.');
  } catch (error) {
    console.error('Échec du build avant E2E:', error);
    process.exit(1);
  }
}
