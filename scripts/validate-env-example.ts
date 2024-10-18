import { readFileSync, existsSync, writeFileSync } from 'fs';

const envsFile = readFileSync('.env');

if (!existsSync('.env.example')) {
  writeFileSync('.env.example', envsFile);
}

const envs = envsFile
  .toString()
  .match(/^\s*([^=\s#]+)/gm)
  ?.map(match => match.trim().split('=')[0]);
const envsExample = readFileSync('.env.example')
  .toString()
  .match(/^\s*([^=\s#]+)/gm)
  ?.map(match => match.trim().split('=')[0]);

if (envs?.every(env => envsExample?.includes(env))) {
  console.log('.env and .env.example files are synced!');

  const missingEnvs = envsExample?.filter(env => !envs.includes(env));

  if (missingEnvs?.length) {
    console.warn(
      `The following values are missing in .env file:\n\n${missingEnvs.join('\n')}\n`,
    );
  }

  process.exit(0);
} else {
  const missingEnvs = envs?.filter(env => !envsExample?.includes(env));

  console.error(
    `The following values are missing in .env.example file:\n\n${missingEnvs?.join('\n')}\n`,
  );

  process.exit(1);
}
