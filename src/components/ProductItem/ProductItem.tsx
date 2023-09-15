import React from 'react';
import { Product } from '../../types/Product';
import styles from './ProductItem.module.scss';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import cn from 'classnames';
import { getFormatDateAndTime } from '../../helpers/getFormatDateAndTime';
import { PriceInfo } from '../PriceInfo';
import { Button } from 'react-bootstrap';
import { getOrderById } from '../../helpers/getOrderById';
import { selectIsOrderSelected } from '../../selectors/itemsSelector';
import { useDispatch, useSelector } from 'react-redux';
import { useMatch } from 'react-router-dom';
import { selectIsOrderDeleteModalOpen } from '../../selectors/modalsSelector';
import { setIsProductDeleteModalOpen } from '../../reducers/modalsSlice';
import { API_URL } from '../../consts/api';
import { setSelectedProduct } from '../../reducers/itemsSlice';

interface ProductItemProps {
  product: Product;
}

export const ProductItem: React.FC<ProductItemProps> = ({ product }) => {
  const dispatch = useDispatch();

  const {
    title,
    specification,
    guarantee,
    isNew,
    isRepairing,
    price = [
      {
        value: 100,
        symbol: 'USD',
        isDefault: true,
      },
      {
        value: 100,
        symbol: 'UAH',
        isDefault: true,
      },
    ],
    type,
    order_id,
    date,
    photo,
  } = product;

  const imageSrc = API_URL + '/images/' + photo;

  const isOrderSelected = useSelector(selectIsOrderSelected);
  const isOrdersPage = useMatch('orders');
  const isOrderDeleteModalOpen = useSelector(selectIsOrderDeleteModalOpen);
  const isShortForm = isOrderSelected && isOrdersPage;

  const isDemoForm = isOrderDeleteModalOpen;

  const orderTitle = 'order';
  //const orderTitle = foundOrder?.title || 'order';

  const condition = isNew ? 'New' : 'Used';
  const status = isRepairing ? 'Ready' : 'Repairing';
  // const { formattedDate: guaranteeStart } = getFormatDateAndTime(
  //   guarantee.start,
  // );
  // const { formattedDate: guaranteeEnd } = getFormatDateAndTime(guarantee.end);
  const { formattedDate: creationDate } = getFormatDateAndTime(date);
  const prices = { priceUSD: price[0].value, priceUAH: price[1].value };

  const handleDeleteProduct = () => {
    dispatch(setSelectedProduct(product));
    dispatch(setIsProductDeleteModalOpen(true));
  };

  return (
    <article
      className={cn(styles.productItem, {
        [styles['productItem--shortForm']]: isShortForm,
        [styles['productItem--demoForm']]: isDemoForm,
      })}
    >
      <div
        className={cn(styles.productItem__indicator, {
          [styles['productItem__indicator--active']]: isRepairing,
        })}
      />
      <img
        className={styles.productItem__img}
        src={imageSrc}
        alt="device photo"
      />
      <div className={styles.productItem__nameInfo}>
        <h2 className={styles['productItem__nameInfo-title']}>{title}</h2>
        <p className={styles['productItem__nameInfo-specification']}>
          {specification}
        </p>
      </div>

      {!isDemoForm && (
        <p
          className={cn(styles.productItem__status, {
            [styles['productItem__status--active']]: isRepairing,
          })}
        >
          {status}
        </p>
      )}

      {!isShortForm && !isDemoForm && (
        <div className={styles.productItem__detailedInfo}>
          <div className={styles.productItem__garantee}>
            <div className={styles['productItem__garantee-start']}>
              <span className={styles['productItem__garantee-label']}>
                from
              </span>{' '}
              {1111}
            </div>
            <p className={styles['productItem__garantee-end']}>
              <span className={styles['productItem__garantee-label']}>to</span>{' '}
              {222}
            </p>
          </div>
          <p className={styles.productItem__condition}>{condition}</p>

          <div className={styles.productItem__price}>
            <PriceInfo prices={prices} />
          </div>

          <p className={styles.productItem__type}>{type}</p>
          <p className={styles.productItem__orderTitle}>{orderTitle}</p>
          <p className={styles.productItem__date}>{creationDate}</p>
        </div>
      )}
      {!isDemoForm && (
        <Button
          onClick={handleDeleteProduct}
          className={styles.productItem__deleteButton}
        >
          <DeleteForeverIcon className={styles.productItem__deleteIcon} />
        </Button>
      )}
    </article>
  );
};
