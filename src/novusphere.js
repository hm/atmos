import { NovusphereAdapter } from '../../eos-forum/src/novusphere/adapter';

const NovusphereConfig = {
    url: 'https://db.novusphere.io',
    collection_forum: 'eosforum',
    collection_post_state: 'ns_post_state',
    collection_post_vote: 'ns_post_vote'
}

function GetNovusphere() {
    return new NovusphereAdapter(NovusphereConfig);
}

export { GetNovusphere };