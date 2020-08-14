import React from 'react';
import './PlaceList.css';
import Card from '../UIElements/Card/Card';
import PlaceItem from '../PlaceItem/PlaceItem';

const PlaceList = props => {
    if(props.items.length === 0) {
        return (
        <div className='place-list center'>
            <Card>
                <h2>No hay ningún lugar. ¿Quieres crear uno?</h2>
                <button>Compartir Lugar</button>
            </Card>
        </div>
        );
    }

    return <ul className='place-list'>
        {props.items.map(place => <PlaceItem key={place.id} id={place.id} image={place.imageUrl} title={place.title} description={place.description} address={place.address} creatorId={place.creator} coordinates={place.location} />)}
    </ul>;
};

export default PlaceList;