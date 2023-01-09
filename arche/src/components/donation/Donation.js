function Donation() {
    const number = '0566242661';
    const name = window.location.href.split('?')[1].split('%20').join(' ');

    return (
        <div>
            <h1>{name}</h1>
            <p>Faite un depot  Wave, Mtn au numero suivant : {number}, merci !!!</p> 
        </div>
    )
}

export default Donation;