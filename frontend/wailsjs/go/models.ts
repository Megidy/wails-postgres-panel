export namespace connection {
	
	export class Connection {
	    connection_id: number;
	    name: string;
	    uri: string;
	    description: string;
	
	    static createFrom(source: any = {}) {
	        return new Connection(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.connection_id = source["connection_id"];
	        this.name = source["name"];
	        this.uri = source["uri"];
	        this.description = source["description"];
	    }
	}
	export class ExecutionResult {
	    data: string[][];
	    is_executable: boolean;
	    affected_rows: number;
	
	    static createFrom(source: any = {}) {
	        return new ExecutionResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = source["data"];
	        this.is_executable = source["is_executable"];
	        this.affected_rows = source["affected_rows"];
	    }
	}

}

export namespace entity {
	
	export class ResponseMetadata {
	    has_error: boolean;
	    err: string;
	
	    static createFrom(source: any = {}) {
	        return new ResponseMetadata(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.has_error = source["has_error"];
	        this.err = source["err"];
	    }
	}
	export class Response__wails_postgres_panel_connection_Connection_ {
	    data?: connection.Connection;
	    response_metadata: ResponseMetadata;
	
	    static createFrom(source: any = {}) {
	        return new Response__wails_postgres_panel_connection_Connection_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], connection.Connection);
	        this.response_metadata = this.convertValues(source["response_metadata"], ResponseMetadata);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response__wails_postgres_panel_connection_ExecutionResult_ {
	    data?: connection.ExecutionResult;
	    response_metadata: ResponseMetadata;
	
	    static createFrom(source: any = {}) {
	        return new Response__wails_postgres_panel_connection_ExecutionResult_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], connection.ExecutionResult);
	        this.response_metadata = this.convertValues(source["response_metadata"], ResponseMetadata);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response____wails_postgres_panel_connection_Connection_ {
	    data: connection.Connection[];
	    response_metadata: ResponseMetadata;
	
	    static createFrom(source: any = {}) {
	        return new Response____wails_postgres_panel_connection_Connection_(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], connection.Connection);
	        this.response_metadata = this.convertValues(source["response_metadata"], ResponseMetadata);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class Response_struct____ {
	    // Go type: struct {}
	    data: any;
	    response_metadata: ResponseMetadata;
	
	    static createFrom(source: any = {}) {
	        return new Response_struct____(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], Object);
	        this.response_metadata = this.convertValues(source["response_metadata"], ResponseMetadata);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice && a.map) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}

}

