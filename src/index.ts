import { Plugin, clientApi } from 'siyuan';
import { showActiveGraph } from './api/echartsApi';
export default class SiyuanSamplePlugin extends Plugin {
    el: HTMLElement;

    constructor() {
        super();
    }

    onload() {
        const button = document.createElement('button');
        button.insertAdjacentHTML('beforeend', '<svg t="1678936666085" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2763" width="18" height="18"><path d="M729.152 316.288c2.752 120.64-17.856 171.008-17.856 171.008-49.344-263.232-224-394.816-321.472-420.992C480.32 373.12 377.6 438.72 377.6 438.72c-4.48-125.632-91.2-155.648-91.2-155.648 49.152 130.048-50.752 164.48-97.792 306.56C112.576 928 570.176 1094.4 774.4 820.096c179.2-246.144-45.248-503.808-45.248-503.808z m-196.48 179.904c126.016 192.512 96 310.208 26.368 358.848-54.528 37.376-105.344 37.376-148.544-12.8-32-39.232-28.224-76.8-11.264-108.416 28.16-54.464 148.48-142.336 133.44-237.632z" p-id="2764"></path></svg>');
        button.addEventListener('click', showActiveGraph);
        clientApi.addToolbarLeft(button);
        this.el = button;
        console.log('plugin load');
    }

    onunload() {
        console.log('plugin unload')
    }
}
