import React from 'react';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import styles from './Card.module.scss';

export type CardProps = {
  id: number,
  pic?: string,
  name?:string,
  desc?:string,
  price_min?:number,
  price_max?:number,
  company?:string,
  onButtonClick?: React.MouseEventHandler;
  onImageClick?: React.MouseEventHandler;
};

const OneCard: React.FC<CardProps> = ({id,pic,name,desc,price_min,price_max,company, onButtonClick, onImageClick }) => {
  
  return (
    <Card className={styles.card}>
    <Link to={`/vacancies/${id}`}>
    <Image className={styles.card__image} onClick={onImageClick} src={pic ? pic : "https://www.solaredge.com/us/sites/nam/files/Placeholders/Placeholder-4-3.jpg"}/>
    <Card.Header className={styles.card__container_name}>{name}</Card.Header>
    </Link>
    <Card.Body>
      <Card.Title className={styles.card__container_price}>{price_min && price_max &&<div>{price_min} - {price_max} ₽</div>}</Card.Title>
      <Card.Title className={styles.card__container_price}>{!price_min && price_max &&<div>до {price_max} ₽</div>}</Card.Title>
      <Card.Title className={styles.card__container_price}>{price_min && !price_max &&<div>от {price_min} ₽</div>}</Card.Title>
      <Card.Text className={styles.card__container_desc}>
        {desc}
      </Card.Text>

      <Card.Text className={styles.card__container_company}>
      {company}
      </Card.Text>
      
     
      
    </Card.Body>
    
  </Card>
  );
}

export default OneCard;

// #f53100 red
// #00AF54 green