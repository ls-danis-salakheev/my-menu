
import { useEffect } from 'react';

import stylesheetUrl from './sasha-theme.css';
import normalizerStylesheetUrl from '~/styles/normalizer.css';

export type MenuItem = {
    productName: string;
    productPrice: string;
    color: string;
    sku: string;
    customItemNameEnabled: boolean;
    pricingStrategy: string;
    defaultTaxAmount: string;
    defaultTaxPercentage: string;
    asSubItem: boolean;
    type: string;
    taxIncludedInPrice: boolean;
    pictureUrl: string;
    description: string | undefined;
}

type Group = {
    id: string;
    name: string;
    color: string;
    menuEntry: MenuItem[];
    type: string;
}

const defaultSizes = {
    menuName: 64,
    groupTitle: 32,
    restaurantName: 12,
};

type SashaThemeProps = {
    menu: Group[];
    menuName: string;
    logo: string;
    showPrice: boolean;
    restaurantName: string;
    theme: 'dark' | 'colorful',
    hiddenItems: Record<string, string[]>;
    sizes: {
        restaurantName: number,
        groupTitle: number,
        menuName: number,
    },
    setDefaultSizes: (args: {
        restaurantName: number,
        groupTitle: number,
        menuName: number,
    }) => void;
}

const theme = {
    dark: {
        groupColor: '#fff',
    },
    colorful: {
        groupColor: '#FF0000',
    }
} as const;

export function SashaTheme({
    menuName,
    logo,
    menu,
    showPrice,
    hiddenItems,
    restaurantName,
    theme: themeName,
    sizes = defaultSizes,
    setDefaultSizes
}: SashaThemeProps) {
    const currentTheme = theme[themeName];

    useEffect(() => {
        setDefaultSizes?.(defaultSizes);
    }, []);

    return (
        <div className={`theme`}>
            <link rel="stylesheet" href={stylesheetUrl}></link>
            <link rel="stylesheet" href={normalizerStylesheetUrl}></link>
            <div className='theme__header'>
                <div className='theme__menu-name' style={{ fontSize: sizes.menuName }}>{menuName}</div>
                {
                    logo && (
                        <div className='theme__branding'>
                            { <img className='theme__restaurant-logo' src={logo} style={{ filter: `grayscale(${themeName === 'dark' ? 1 : 0})` }} alt={restaurantName} /> }
                            <div className='theme__restaurant-name' style={{ fontSize: sizes.restaurantName }}>{restaurantName}</div>
                        </div>
                    )
                }
            </div>
            <div className='theme__menu'>
                <ul className='theme__menu-groups menu-groups menu-groups__list'>
                    {
                        menu.map(({ id, name, menuEntry }) => (
                            hiddenItems[id]?.length !== menuEntry.length && (
                                <li className='menu-groups__item' key={id}>
                                    <div className='menu-groups__heading' style={{ color: currentTheme.groupColor, fontSize: sizes.groupTitle }}>{name}</div>
                                    <ul>
                                        {
                                            menuEntry.map(({ sku, productName, productPrice, description }) => (
                                                !hiddenItems[id]?.includes(productName) && (
                                                    <li className='menu-groups__product-item' key={sku}>
                                                        <div className='menu-groups__content'>
                                                            <p className='menu-groups__product-name'>{productName}</p>
                                                            <p className='menu-groups__product-description'>{description}</p>
                                                        </div>
                                                        {
                                                            showPrice && <p className='menu-groups__product-price'>${productPrice}</p>
                                                        }
                                                    </li>
                                                )
                                            ))
                                        }
                                    </ul>
                                </li>
                            )
                        ))
                    }
                </ul>
            </div>
        </div>
    );
}
