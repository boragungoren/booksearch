import React, { Component } from 'react'
import { Menu, Container, Image, Form, Card } from 'semantic-ui-react';
import LoaderWithText from './LoaderWithText';
import logo from './book.svg';

const API_KEY = 'AIzaSyBTDfzdtanhLpztL7sl8eh4K6tLg8gpHz0';

export class BookSearch extends Component {
  state = {
    loading: false,
    books: undefined,
    search: '',
    ww: window.innerWidth,
  }

  fetchBooks = async (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    })
    const searchTerms = this.state.search;
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerms}&key=${API_KEY}`);
    const jsonResponse = await response.json();
    this.setState({
      loading: false,
      books: jsonResponse
    })
  }

  changeInputHandler = e => {
    this.setState({
      search: e.target.value
    })
  }

  handleWindowSizeChange = () => {
    this.setState({ ww: window.innerWidth });
  };
  
  componentDidMount = () => {
    window.addEventListener('resize', this.handleWindowSizeChange);
  }

  render() {

    const { books, search, loading, ww } = this.state;

    const booksInfo = (books && books.items) ?
    <Card.Group centered itemsPerRow={5} stackable={true}  style={{margin: '0 1rem', paddingTop: '6rem'}}>
      {books.items.map(item => {
        const info = item.volumeInfo;
        const id = item.id;
        const {
          title = 'No title data.',
          authors = ['No author data.'],
          description = '',
          imageLinks = '',
          infoLink = '',
          publishedDate,
          publisher,
        } = info;

        return (
          <Card key={id} href={infoLink} color="brown">
            <Image wrapped src={imageLinks.thumbnail} />
            <Card.Content>
              <Card.Header>{title}</Card.Header>
              <Card.Meta>{authors.join(' / ')}</Card.Meta>
              <Card.Description>{description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              {publishedDate && publisher && <p>{`Published ${publishedDate && `on ${publishedDate}`} ${publisher && `on ${publisher}`}`}</p>}
            </Card.Content>
          </Card>
        )
      })}
    </Card.Group> : 
    <div style={{ paddingTop: '6rem', minHeight: '90vh', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
      <h2 style={{ alignSelf: 'center' }}>Şuan gösterilecek sonuç yok.</h2>
    </div>;
    

    return (
      <>
        <Menu borderless fixed="top">
          <Container>
            <Menu.Item>
              <Image size="mini" src={logo} />
            </Menu.Item>
            { ww >= 400 && <Menu.Item header>Google kitap arama uygulaması</Menu.Item> }
            <Menu.Item position="right">
              <Form size={ ww >= 500 && 'mini'} onSubmit={this.fetchBooks}>
                <Form.Group>
                  <Form.Input
                    placeholder="Kitap aramak için..."
                    type="search"
                    name="search"
                    action={
                      
                      {
                      color: 'brown',
                      content: ww >= 500 ? 'Ara' : null,
                      icon: 'search'
                    }}
                    value={search}
                    onChange={this.changeInputHandler} />
                </Form.Group>
              </Form>
            </Menu.Item>
          </Container>
        </Menu>

        { loading ?
          <div style={{ paddingTop: '6rem', minHeight: '90vh', display: 'flex', alignItems: 'center' }}>
            <LoaderWithText text="Yükleniyor..." />
          </div> :
          booksInfo

        }
      </>
    )
  }
}

export default BookSearch
