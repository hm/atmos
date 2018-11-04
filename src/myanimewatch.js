import requests from "@/requests";
import { GetNovusphere } from "@/novusphere";
import { GetIdentity } from "@/eos";

import { Post } from "../../eos-forum/src/types/post";

export default {
    async getAnimeInfo(id) {
        return requests.get(`https://api.jikan.moe/v3/anime/${id}`);
    },
    async getSeasonAnime(year, month) {
        return requests.get(`https://api.jikan.moe/v3/season/${year}/${month}`);
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

        var responses = (await novusphere.api({
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
                }
            ]
        })).cursor.firstBatch;

        await Post.threadify(main_post, responses);

        return {
            main_post: main_post,
            all_posts: responses
        }
    },
}