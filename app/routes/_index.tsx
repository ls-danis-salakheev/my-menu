
import { useEffect, useMemo, useState } from 'react';
import { FlameTheme, FlameGlobalStyles } from '@lightspeed/flame/Core';
import { Input } from '@lightspeed/flame/Input';
import { Text } from '@lightspeed/flame/Text';
import { Button } from '@lightspeed/flame/Button';
import { IconDesign } from '@lightspeed/flame/Icon/Design';
import { IconExport } from '@lightspeed/flame/Icon/Export';
import { Select } from '@lightspeed/flame/Select';
import { Divider } from '@lightspeed/flame/Divider';
import { Checkbox } from '@lightspeed/flame/Checkbox';
import { Flex } from '@lightspeed/flame/Core';
import { Spinner } from '@lightspeed/flame/Spinner';
import { SashaTheme, MenuItem } from '~/components/sasha-theme/sasha-theme';
import { DanisTheme } from '~/components/danis-theme/danis-theme';
import { createPortal } from 'react-dom';
import { authenticator } from '~/utils/auth.server';
import { LoaderArgs, redirect } from '@remix-run/node';

const TEMPLATE = {
  sasha: SashaTheme,
  danis: DanisTheme,
}

export const loader = async ({ request }: LoaderArgs) => {
  const token = await authenticator.isAuthenticated(request);

  if (!token) {
    return redirect('/auth/auth0');
  }

  return null;
};

export const IFrame = ({
    children,
    ...props
  }) => {
    const [contentRef, setContentRef] = useState(null)
    const mountNode =
      contentRef?.contentWindow?.document?.body
  
    return (
      <iframe {...props} ref={setContentRef}>
        {mountNode && createPortal(children, mountNode)}
      </iframe>
    )
}

function FontSizeSelect({ value = 'default', onChange }) {
    return (
        <Select value={value} onChange={onChange}>
            <option value='default'>-</option>
            <option value='10'>10</option>
            <option value='11'>11</option>
            <option value='12'>12</option>
            <option value='13'>13</option>
            <option value='14'>14</option>
            <option value='15'>15</option>
            <option value='16'>16</option>
            <option value='20'>20</option>
            <option value='21'>21</option>
            <option value='24'>24</option>
            <option value='32'>32</option>
            <option value='36'>36</option>
            <option value='40'>40</option>
            <option value='48'>48</option>
            <option value='61'>61</option>
            <option value='64'>64</option>
            <option value='96'>96</option>
            <option value='100'>100</option>
            <option value='104'>104</option>
            <option value='106'>106</option>
            <option value='110'>110</option>
            <option value='116'>116</option>
            <option value='128'>128</option>
        </Select>
    )
}

export const useData = (url) => {
  const [state, setState] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dataFetch = async () => {
      setIsLoading(true);
      const data = await (await fetch(url)).json();

      setState(data);
      setIsLoading(false);
    };

    dataFetch();
  }, [url]);

  return { data: state, isLoading };
};

function Menu() {
    const [currentLocation, setCurrentLocation] = useState('629066679975938');
    const [restaurantName, setRestaurantName] = useState('Good taste');
    const [menuName, setMenuName] = useState('Menu');
    const [selectedMenu, setSelectedMenu] = useState('');
    const [theme, setTheme] = useState('colorful' as const);
    const [image, setImage] = useState<string>('');
    const [showPrice, setShowPrice] = useState(true);
    const [hiddenItems, setHiddenItems] = useState<Record<string, string[]>>({});
    const [fontSizes, setFontSizes] = useState<Record<string, number> | undefined>(undefined);
    const [templateName, setTemplateName] = useState<keyof typeof TEMPLATE>('sasha');

    const { data: menusData, isLoading: isMenusLoading } = useData(`/menus?businessLocationId=${currentLocation}`);
    const { data: menu, isLoading: isMenuLoading } = useData(`/get_menu?businessId=36616&businessLocationId=${currentLocation}&menuId=${selectedMenu || 629066679975976}`);

    const Template = TEMPLATE[templateName];

    const onChange = (event) => {
        if(!event.target?.files[0]) {
            setImage('');
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            console.log(event.target?.result);
            setImage(String(event.target?.result));
        };
        reader.readAsDataURL(event.target.files[0]);
      }

      const toggleMenu = (checked: boolean, menu: string, products: MenuItem[]) => {
        setHiddenItems((prev) => {
            return {
                ...prev,
                [menu]: checked ? [] : products.map(({ productName }) => productName),
            }
        });
    }

    const toggleItem = (checked: boolean, menu: string, product: string) => {
        setHiddenItems((prev) => {
            if (!checked) {
                return {
                    ...prev,
                    [menu]: [...(prev[menu] || []), product],
                }
            }

            const products = prev[menu].filter((currentProduct) => currentProduct !== product);

            return {
                ...prev,
                [menu]: products,
            }
        });
    }

    const onChangeToggleAll = (checked: boolean) => {
        if (checked) return setHiddenItems({});

        const newHiddenItems = menu.menuEntryGroups.reduce((prev, { id, menuEntry }) => ({
            ...prev,
            [id]: menuEntry.map(({ productName }) => productName)
        }), {});

        setHiddenItems(newHiddenItems);
    }

    return (
        <FlameTheme>
            <FlameGlobalStyles />
            <div className="page">
                <div className='page__sidebar menu-creater'>
                    <img className='menu-creater__logo' src='./lightspeed.png'/>
                    {
                      menu ? (
                        <div className='menu-creater__items'>
                            <Checkbox
                                defaultChecked
                                label='Menu'
                                className={'checkbox checkbox--1'}
                                onChange={(e) => onChangeToggleAll(e.target.checked)}  
                            />
                            <Divider />
                            {
                                menu.menuEntryGroups.map((group) => (
                                    <>
                                        <Checkbox
                                            defaultChecked
                                            label={group.name}
                                            className={'checkbox checkbox--2'}
                                            indeterminate={hiddenItems[group.id]?.length !== 0 && hiddenItems[group.id]?.length !== group.menuEntry.length}
                                            checked={!hiddenItems[group.id]?.length}
                                            onChange={(e) => toggleMenu(e.target.checked, group.id, group.menuEntry)} 
                                        />
                                        <Divider />
                                        {
                                            group.menuEntry.map((menu) => (
                                                <>
                                                    <Checkbox
                                                        defaultChecked
                                                        label={menu.productName}
                                                        className={'checkbox checkbox--3'}
                                                        onChange={(e) => toggleItem(e.target.checked, group.id, menu.productName)}
                                                        checked={!hiddenItems[group.id]?.includes(menu.productName)}
                                                    />
                                                    <Divider />
                                                </>
                                            ))
                                        }
                                    </>
                                ))
                            }
                        </div>
                      ) : <Spinner />
                    }
                </div>
                <div className='page__viewer'>
                    {
                      menu ? (
                        <IFrame id='pdf' className={'viewer'}>
                            <Template
                              setDefaultSizes={setFontSizes}
                              sizes={fontSizes}
                              menuName={menuName}
                              theme={theme}
                              menu={menu.menuEntryGroups}
                              hiddenItems={hiddenItems}
                              logo={image}
                              showPrice={showPrice}
                              restaurantName={restaurantName}
                            />
                        </IFrame>
                      ) : <Spinner size='big' />
                    }
                </div>
                <div className='page__sidebar editor'>
                    <div className='editor__row'>
                      <Text as="h3" fontWeight="700" mb={1}>Business locations</Text>
                      <Select value={currentLocation} onChange={(e) => setCurrentLocation(e.target.value)}>
                        <option value='629066679975938'>Chez Giorgi</option>
                        <option value='629066679976136'>Abanico Cocina</option>
                      </Select>
                    </div>
                    {
                      <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Choose menu</Text>
                        <Select value={selectedMenu} onChange={(e) => setSelectedMenu(e.target.value)}>
                          {
                            menusData ? menusData.nodes.map(({ id, name }, index) => (
                              <option selected={index === 0} value={id} key={id}>{name}</option>
                            )) : null
                          }
                        </Select>
                      </div>
                    }
                    <Divider mb={2} />
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Menu name</Text>
                        <Input type='text' defaultValue={selectedMenu} value={menuName} onChange={(e) => setMenuName(e.target.value)} />
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Restaurant name</Text>
                        <Input type='text' value={restaurantName}  onChange={(e) => setRestaurantName(e.target.value)}/>
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Restaurant logo</Text>
                        <Button css={{}}>
                            <IconExport /> 
                            <label htmlFor="file-upload">Upload image</label>
                        </Button>
                        <input style={{ display: 'none' }} type='file' id='file-upload' onChange={onChange} />
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Template</Text>
                        <Flex>
                            <img className={`editor__theme ${templateName === 'danis' ? 'editor__theme--current' : ''}`} src='./danis.png' onClick={() => setTemplateName('danis')} />
                            <img className={`editor__theme ${templateName === 'sasha' ? 'editor__theme--current' : ''}`} src='./sasha.png' onClick={() => setTemplateName('sasha')} />
                        </Flex>
                    </div>
                    <div className='editor__row'>
                        <Checkbox
                            defaultChecked
                            label='Show prices'
                            checked={showPrice}
                            onChange={() => setShowPrice((prev) => !prev)}
                        />
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Color scheme</Text>
                        <Flex>
                            <Button onClick={() =>{setTheme('colorful')}}><IconDesign baseColor='#2E61DE' />In color</Button>
                            <Button onClick={() =>{setTheme('dark')}}><IconDesign />Black and white</Button>
                        </Flex>
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Font size for restaurant name</Text>
                        <FontSizeSelect value={fontSizes?.restaurantName} onChange={(e) => setFontSizes((sizes) => ({ ...sizes, restaurantName: e.target.value}))} />
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Font size for menu name</Text>
                        <FontSizeSelect value={fontSizes?.menuName} onChange={(e) => setFontSizes((sizes) => ({ ...sizes, menuName: e.target.value}))} />
                    </div>
                    <div className='editor__row'>
                        <Text as="h3" fontWeight="700" mb={1}>Font size for group title</Text>
                        <FontSizeSelect value={fontSizes?.groupTitle} onChange={(e) => setFontSizes((sizes) => ({ ...sizes, groupTitle: e.target.value}))} />
                    </div>
                    <div className='editor__footer'>
                      <Button variant='secondary' fill width='100%' mt='auto' onClick={() => {document.getElementById('pdf').contentWindow.print()}}><IconExport baseColor='#fff' /> Export PDF</Button>
                    </div>
                </div>
            </div>
        </FlameTheme>
    );
  }

export default Menu;