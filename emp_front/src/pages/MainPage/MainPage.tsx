import * as React from 'react';

export type Subscription = {
    id: number,
    title: string,
    price: number,
    info: string,
    src: string,
    idCategory: number,
    categoryTitle: string,
    status: string
}

export type ReceivedSubscriptionData = {
    id: number,
    title: string,
    price: number,
    info: string,
    src: string,
    id_category: number,
    category: string,
}



const MainPage: React.FC = () => {
    
 
    return (
        <div>Mainpage</div>
    )
};
  
export default MainPage;