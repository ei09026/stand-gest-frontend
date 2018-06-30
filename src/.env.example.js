let env = {
    app_env: 'local',

    router_prefix: '',
    
    idt2auth_domain_id: '',
    idt2auth_client_id: '',
    
    // endpoint_auth: 'http://democss.itgest.pt:50000',
    // endpoint_backend: 'http://democss.itgest.pt:50001',
    endpoint_auth: 'http://localhost:8082',
    endpoint_backend: 'http://localhost:8081',
    
    build_hash: 'hash will be auto injected',
    build_number: ''
}

export default env
