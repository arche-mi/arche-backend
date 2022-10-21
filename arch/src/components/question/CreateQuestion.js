

const fetchUserQuestions = async () => {
    try {
        //get user preview questions **************** 
        const questions = {};
        return questions;
    } catch (error) {
        console.log(error);
    }
}

const create = async () => {
    try {
        const title = document.querySelector('#title').value;
        const text = document.querySelector('#text').value;
        const tags = document.querySelector('#title').value;        
        let questions = fetchUserQuestions();
        const date = new Date();
        questions[0] = [title, text, tags, date];

        //push new on firebase **************************
        console.log(questions);

    } catch (error) {
        console.log(error);
    }
};

function createQuestion() {
    return (
        <div>
            <h2>Poser une question?</h2>
                <label>
                    Titre:
                    <input type="text" id="title" name="title" />
                </label><br></br>
                <label>
                    Contenu:
                    <textarea id="text"></textarea>
                </label><br></br>
                <label>
                    Tags:
                    <input type="text" id="tags" name="tags" />
                </label><br></br>
                <button onClick={create}>Poser</button>
        </div>
    )
}

export default createQuestion;