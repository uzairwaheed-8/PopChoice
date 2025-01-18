/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { genAI, supabase, hf } from './Config';
import Data from './Data';
import icon from '../assets/icon.svg';
import { pipeline } from '@xenova/transformers';
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { useNavigate } from 'react-router-dom';

const Qs = ({ setRes, setImg, setTitle,setList }) => {
    const [ques1, setQues1] = useState("");
    const [ques2, setQues2] = useState("");
    const [ques3, setQues3] = useState("");
    const navigator = useNavigate()
    const [embed, setEmbed] = useState(null);
    const [embedStore, setEmbedStore] = useState([]);
    const [store, setStore] = useState(null);
    const style = {
        fontFamily: "Carter One"
    }
    const genres = [
        { id: 28, name: 'Action' },
        { id: 12, name: 'Adventure' },
        { id: 16, name: 'Animation' },
        { id: 35, name: 'Comedy' },
        { id: 80, name: 'Crime' },
        { id: 99, name: 'Documentary' },
        { id: 18, name: 'Drama' },
        { id: 10751, name: 'Family' },
        { id: 14, name: 'Fantasy' },
        { id: 36, name: 'History' },
        { id: 27, name: 'Horror' },
        { id: 10402, name: 'Music' },
        { id: 9648, name: 'Mystery' },
        { id: 10749, name: 'Romance' },
        { id: 878, name: 'Science Fiction' },
        { id: 10770, name: 'TV Movie' },
        { id: 53, name: 'Thriller' },
        { id: 10752, name: 'War' },
        { id: 37, name: 'Western' }
    ];


    const resGen = async (question, context) => {
        try {
            const chatMsg = [{
                role: 'system',
                content: `You are an enthusiastic Movies expert who loves recommending movies to people. You will be given two pieces of information - list of movies as context and user preferences . Your main job is to recommend a movie using the provided context.If you are unsure and cannot find the Movie in the context, say, "Sorry, I don't know the answer." Please do not make up the answers.`
                // content: `You are a passionate and knowledgeable movie enthusiast who loves helping people discover great films. You will be provided with two inputs:
                // A list of movies as context (including their title, popularity, release date, genre, description, and poster URL).
                // User preferences
                // Your task is to recommend a movie from the provided context that best matches the user's preferences. When recommending, act like a friendly movie expert, offering thoughtful suggestions rather than copying the context directly. Use the information creatively to make the recommendation personal and engaging.
                // Complete sentences and don't generate incomplete sentences.
                // If none of the movies in the context match the user's preferences, respond with: "Sorry, I don’t know the answer." Do not fabricate movies or details.`
            }, {
                role: 'user',
                content: `Context: ${context} user Prefernces: ${question}`
            }
            ]
            const out = await hf.chatCompletion({
                model: "mistralai/Mistral-7B-Instruct-v0.2",
                // model: "HuggingFaceH4/starchat2-15b-v0.1",
                // model: "meta-llama/Llama-2-7b-chat-hf",
                messages: chatMsg,
                temperature: 0.5,
                seed: 0,
            })
            console.log(out);
            console.log(out.choices[0].message.content);
            // setRes(out.choices[0].message.content);
            return out.choices[0].message.content;
        } catch (error) {
            console.error('Error generating response:', error);
        }
    };

    const handleClick = async () => {
        try {
            const questions = [ques1, ques2, ques3];
            const concatenatedQuestions = questions.join(" ");

            setQues1("");
            setQues2("");
            setQues3("");

            const generatedEmbed = await genEmbed(concatenatedQuestions);
            setEmbed(generatedEmbed);

            if (generatedEmbed) {
                const similarMovies = await findSimilar(generatedEmbed);
                // console.log(similarMovies);
                // setRes(similarMovies);
                const moviearr = similarMovies.split("||\n");
                setList(moviearr);
                console.log(moviearr);
                const llmRes = await resGen(concatenatedQuestions, similarMovies);
                const recommend = llmRes.split("||\n");
                setRes(recommend[recommend.length - 1]);
                console.log("1st", recommend[recommend.length])
                console.log("2nd", recommend);
                moviearr.map((movie) => {
                    let title = movie.split("Popularity");
                    title = title[0].split("Title: ");
                    let condi = recommend[recommend.length - 1].match(title[1].trim());
                    if (condi) {
                        console.log('I m in if : ', title[1]);
                        setImg(movie.split("poster_path : ")[1]);
                        setTitle(title[1]);
                    }
                });
            }
            navigator('/res');

        } catch (error) {
            console.error("Error handling click:", error);
        }
    };

    useEffect(() => {
        // if (store && embedStore.length === 0) {
        //     createAndStoreEmbeddings();
        // }
        console.log(store);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);

    const genEmbed = async (text) => {
        try {
            const EmbedModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
            const result = await EmbedModel.embedContent(text);
            return result.embedding.values;
        } catch (error) {
            console.error('Error generating embedding:', error);
        }
    };

    const getGenresFromIds = (genreIds) => {
        return genreIds.map(id => {
            const genre = genres.find(genre => genre.id === id);
            return genre ? genre.name : 'Unknown Genre';
        });
    };

    const createAndStoreEmbeddings = async () => {
        try {
            const embeddingData = await Promise.all(
                store.map(async (movie) => {
                    const genre = getGenresFromIds(movie.genre_ids);
                    const text = `Title: ${movie.title}  Popularity: ${movie.popularity}  Release date: ${movie.release_date}  Genre: ${genre.join(", ")}  Description: ${movie.overview} poster_path : https://image.tmdb.org/t/p/w500${movie.poster_path}`;
                    const embed = await genEmbed(text);
                    return { content: text, embedding: embed };
                })
            );

            console.log('Saving data to Supabase:', embeddingData);

            const { data, error } = await supabase
                .from('documents')
                .upsert(embeddingData, { onConflict: ['content'] })
                .select();

            if (error) {
                console.error('Error saving data to Supabase:', error);
            } else {
                console.log('Data saved successfully to Supabase:', data);
                setEmbedStore(embeddingData.map(item => item.embedding));
            }
        } catch (error) {
            console.error('Error in createAndStoreEmbeddings:', error);
        }
    };


    const findSimilar = async (inp) => {
        try {
            console.log('Finding similar movies...');
            const { data, error } = await supabase.rpc('match_documents', {
                query_embedding: inp,
                match_threshold: 0.50,
                match_count: 4
            });

            if (error) {
                console.error('Error in findSimilar:', error);
                return;
            }

            if (!data || data.length === 0) {
                console.log('No similar documents found');
                return "";
            }

            console.log('Matches found:', data); // Debugging
            // setRes(data);
            const match = data.map(obj => obj.content).join('||\n');
            console.log('Matching movies:', match);
            return match;
        } catch (error) {
            console.error('Error during findSimilar:', error);
        }
    };

    return (
        <div style={style} className='bg-[#000C36] text-white p-4 lg:p-8 flex flex-col justify-center items-center min-h-screen font-sans'>
            <img src={icon}></img>
            <Data setStore={setStore} />
            <h1 className='text-5xl font-bold pt-3 pb-10'>Pop Choice</h1>
            <label htmlFor="ques-1" className='font-thin pb-2'>What&apos;s movies you like and why?</label>
            <textarea
                id="ques-1"
                value={ques1}
                onChange={(e) => setQues1(e.target.value)}
                placeholder='i.e i like movies which are based on real life stories like movies names..'
                rows="1"
                className="bg-[#3B4877] border-[#3B4877] px-4 py-3 text-xs border-0 rounded-xl resize-none overflow-hidden w-[250px]"
                onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
            />
            <br />

            <label htmlFor="ques-2" className='font-thin pb-2'>what&lsquo;s genres you like to watch?</label>
            <textarea
                id="ques-2"
                value={ques2}
                placeholder='i.e The Genres i like to watch are action,comedy..'
                onChange={(e) => setQues2(e.target.value)}
                rows="1"
                className="bg-[#3B4877] border-[#3B4877] px-4 py-3 text-xs border-0 rounded-lg resize-none overflow-hidden w-[250px]"
                onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
            /><br />

            <label htmlFor="ques-3" className='font-thin pb-2'>What are You in mood for ? </label>
            <textarea
                id="ques-3"
                value={ques3}
                onChange={(e) => setQues3(e.target.value)}
                placeholder='i.e Currently Im in mood to watch something fun and horror...'
                className="bg-[#3B4877] border-[#3B4877] px-4 py-3 text-xs  border-0 rounded-xl resize-none overflow-hidden w-[250px]"
                onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                }}
            /><br />

            <button onClick={handleClick} className='bg-[#51E08A] px-20 py-4 text-black text-xl font-bold rounded-lg mt-8'>Let&apos;s Go</button>
        </div>
    );
};

export default Qs;
