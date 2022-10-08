import express, { Express } from 'express';
import needle from 'needle';
import puppeteer from 'puppeteer';
import { config } from './app.config';
import { logger } from './shared/modules/Logger/Logger.module';
import fse from 'fs-extra';
import { Stream } from 'form-data';
import path from 'path';
import fetch from 'node-fetch';

const firstExercise = '#exercises > a.exercise.current';
const cond_selector = '#exercise > div.condition > div > img';
const dec_selector = '#exercise > div.decision > div > img';

interface ITags {
	folder: string;
	adress: string;
	src: string;
	extension: string;
}

type IImage = ITags & {
	$el: HTMLImageElement & ITags;
};

async function stream2buffer(stream: Stream): Promise<Buffer> {
	return new Promise<Buffer>((resolve, reject) => {
		const _buf = Array<any>();

		stream.on('data', (chunk) => _buf.push(chunk));
		stream.on('end', () => resolve(Buffer.concat(_buf)));
		stream.on('error', (err) => reject(`error converting stream - ${err}`));
	});
}

export class App {
	app: Express;

	constructor() {
		this.app = express();
	}

	init = () => {
		this.app.listen(config.PORT, () => {
			logger.log(`[App]: server start on ${config.PORT} port...`);
		});

		this.useRoutes();
	};

	useRoutes = () => {
		this.app.use('/api', express.static(path.join(process.cwd(), 'assets')));
	};

	getAttributes = (selectors: string[]) => {
		return selectors
			.map((selector) => {
				const $el = document.querySelector<IImage['$el']>(selector);

				if ($el) {
					return {
						folder: $el.getAttribute('folder'),
						adress: $el.getAttribute('adress'),
						src: $el.getAttribute('src'),
						extension: $el.getAttribute('extension'),
					};
				}
			})
			.filter((attr): attr is IImage => Boolean(attr));
	};

	getExercises = (section: string | number) => {
		return Array.from(
			document.querySelectorAll(`#exercises > a.exercise[img^="/${section}/"]`),
		).map((item) => item.innerHTML);
	};

	onSaveImage = async (attr: IImage) => {
		const pathToFile = path.join(
			process.cwd(),
			`assets/${attr.folder}${attr.adress}.${attr.extension}`,
		);

		const response = await fetch(attr.src);
		const arrayBuffer = await response.buffer();
		await fse.outputFile(pathToFile, arrayBuffer);
	};

	scrape = async (url: string) => {
		const browser = await puppeteer.launch({ headless: true });
		const page = await browser.newPage();
		await page.goto(url);

		const sections = Array.from({ length: 40 }).map((_, idx) => idx + 1);

		for await (const section of sections) {
			const exercises = await page.evaluate(this.getExercises, section);
			logger.log('[PUPPETEER]:', `exercises: ${exercises}`);

			for await (const exercise of exercises) {
				logger.log('[PUPPETEER]:', `section: ${section}, exercise: ${exercise}`);

				await page.click(`#exercises > a.exercise[img^="/${section}/${exercise}"]`);

				const [cond, dec] = await page.evaluate(this.getAttributes, [cond_selector, dec_selector]);
				await this.onSaveImage(cond);
				await this.onSaveImage(dec);
			}
		}

		logger.log('[PUPPETEER]:', 'close browser');
		browser.close();
	};
}
