export class Config {

    public queueSize: Number;
    public historySize: Number;

    public static initEmpty() {
        let conf = new Config();
        return conf;
    }
}
