import { AxiosStatic } from "axios";

export interface StormGlassPointSource{
    [key: string]: number;
}

export interface StormGlassPoint{
    readonly time: string;
    readonly waveHeight: StormGlassPointSource;
    readonly waveDirection: StormGlassPointSource;
    readonly swellDirection: StormGlassPointSource;
    readonly swellHeight: StormGlassPointSource;
    readonly swellPeriod: StormGlassPointSource;
    readonly windDirection: StormGlassPointSource;
    readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse{ //resposta que vem da API externa
    hours: StormGlassPoint[];
}

export interface ForecastPoint{
    time: string;
    waveHeight: number;
    waveDirection: number;
    swellDirection: number;
    swellHeight: number;
    swellPeriod: number;
    windDirection: number;
    windSpeed: number;
}

export class StormGlass {
    readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';
    constructor(protected request: AxiosStatic){}
    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
        const response = await this.request.get<StormGlassForecastResponse>(
            `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`
            )
        return this.normalizeResponse(response.data);
    }
    /*
    Para tipar um parametro de um metodo, basta colocar dessa forma:
        nomeParametro: tipoParametro

    Para tipar o retorno do metodo, após os parenteses colocamos:
        metodo(parametros...): tipoRetorno {}
    */

    /*
    metodo para normalizar resposta que vem da API, a resposta chega no formato do arquivo:
        test/fixtures/stormglass_weather_3_hours.json

    e deve retornar no formato do arquivo:
        test/fixtures/stormGlass_normalized_response_3_hours
    */
    private normalizeResponse(point: StormGlassForecastResponse): ForecastPoint[]{
        return point.hours.filter(this.isValidPoint.bind(this)).map((point)=>({
            swellDirection: point.swellDirection[this.stormGlassAPISource],
            swellHeight: point.swellHeight[this.stormGlassAPISource],
            swellPeriod: point.swellPeriod[this.stormGlassAPISource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassAPISource],
            waveHeight: point.waveHeight[this.stormGlassAPISource],
            windDirection: point.windDirection[this.stormGlassAPISource],
            windSpeed: point.windSpeed[this.stormGlassAPISource],
        }))
    }

    /*
        Partial força a todas as chaves daquele objeto a se tornarem opcionais
    */
    private isValidPoint(point: Partial<StormGlassPoint>): boolean{
        return !!(
            point.time &&
            point.swellDirection?.[this.stormGlassAPISource] &&
            point.swellHeight?.[this.stormGlassAPISource] &&
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]
    )} 
} 