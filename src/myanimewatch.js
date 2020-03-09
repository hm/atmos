import axios from "axios";
// import { GetNovusphere } from "@/novusphere";
// import { GetIdentity } from "@/eos";
// import { Post } from "../../eos-forum/src/types/post";

export default {
    async getAnimeInfo(id) {
        return axios.get(`https://api.jikan.moe/v3/anime/${id}`);
    },
    async getSeasonAnime(year, month) {
        return axios.get(`https://api.jikan.moe/v3/season/${year}/${month}`);
    },
    async getTwistAnime() {
      return axios.get(`http://api.streamani.me?url=api/anime`, {
        headers: {
          'Access-Control-Allow-Headers': 'x-access-token',
          'x-access-token': '1rj2vRtegS8Y60B3w3qNZm5T2Q0TN2NR'
        },
      });
    },
    async searchAnime(query) {
        return axios.get(`https://api.jikan.moe/v3/search/anime?q=${encodeURI(query)}&page=1`);
    },
    async getEpisodePost(id) {
        const novusphere = GetNovusphere();
        const identity = await GetIdentity();

        var main_post = (await novusphere.api({
            aggregate: novusphere.config.collection_forum,
            maxTimeMS: 1000,
            cursor: {},
            pipeline: [
                { $match: novusphere.query.match.postsByTag(`mal${id}`) },
                { $match: { "data.reply_to_post_uuid": "" } },
                { $sort: novusphere.query.sort.time(true) },
                { $limit: 1 },
                { $lookup: novusphere.query.lookup.postState() },
                { $lookup: novusphere.query.lookup.postMyVote(identity.account) },
                {
                    $project: novusphere.query.project.post({
                        normalize_up: true,
                        normalize_my_vote: true
                    })
                }
            ]
        })).cursor.firstBatch[0];

        main_post = new Post(main_post);
        await main_post.normalize();
        return main_post;
    },
    async getEpisodeThread(id) {
        const novusphere = GetNovusphere();
        const identity = await GetIdentity();

        var main_post = await this.getEpisodePost(id);

        if (main_post.id) {
            var responses = [];
            var r_skip = 0;

            for (; ;) {
                var _responses = (await novusphere.api({
                    aggregate: novusphere.config.collection_forum,
                    maxTimeMS: 1000,
                    cursor: {},
                    pipeline: [
                        { $match: novusphere.query.match.threadReplies(main_post.data.post_uuid) },
                        { $lookup: novusphere.query.lookup.postState() },
                        { $lookup: novusphere.query.lookup.postMyVote(identity.account) },
                        {
                            $project: novusphere.query.project.post({
                                normalize_up: true,
                                normalize_my_vote: true
                            })
                        },
                        { $skip: r_skip }
                    ]
                })).cursor.firstBatch;

                r_skip += _responses.length;

                for (var i = 0; i < _responses.length; i++)
                    responses.push(_responses[i]);

                if (!_responses || _responses.length == 0 || _responses.length < 100)
                    break;
            }

            await Post.threadify(main_post, responses);
        }

        return {
            main_post: main_post,
            all_posts: responses
        }
    },
}
