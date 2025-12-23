const puppeteer = require('puppeteer');
const path = require('path');

async function generateOG() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport to exact OG dimensions
    await page.setViewport({
        width: 1200,
        height: 630,
        deviceScaleFactor: 2 // 2x for retina quality
    });

    const htmlPath = path.join(__dirname, 'og-generator.html');
    console.log(`Loading: ${htmlPath}`);

    await page.goto(`file://${htmlPath}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
    });

    // Wait for fonts to load
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 1000));

    const outputPath = path.join(__dirname, 'public media', 'OG-new.png');
    console.log(`Saving to: ${outputPath}`);

    await page.screenshot({
        path: outputPath,
        type: 'png',
        clip: {
            x: 0,
            y: 0,
            width: 1200,
            height: 630
        }
    });

    console.log('OG image generated successfully!');
    console.log(`Output: ${outputPath}`);
    console.log('Dimensions: 2400x1260 (2x retina) / displays as 1200x630');

    await browser.close();
}

generateOG().catch(err => {
    console.error('Error generating OG:', err);
    process.exit(1);
});
