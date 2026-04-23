const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'front/src/locales');
if (fs.existsSync(localesDir)) {
  const envs = fs.readdirSync(localesDir);
  for (const env of envs) {
    const jsonPath = path.join(localesDir, env, 'translation.json');
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
      if (data.events) delete data.events;
      if (data.nav && data.nav.events) delete data.nav.events;
      fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));
      console.log(`Updated ${jsonPath}`);
    }
  }
}
