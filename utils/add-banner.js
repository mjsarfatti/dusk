const pckgJson = require(`${process.env.PWD}/package.json`);

const banner = `/*!
 * ${pckgJson.name} v${pckgJson.version}
 * ${pckgJson.description}
 * ${pckgJson.homepage}
 * ${pckgJson.license} License
 * by ${pckgJson.author}
 */

`;

process.stdout.write(banner);
process.stdin.pipe(process.stdout);
