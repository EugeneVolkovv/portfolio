var my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    readmoreClick: function (e) {
        e.preventDefault();
        this.setState({visible: true});
    },
    render:
        function () {
            var author = this.props.data.author,
                text = this.props.data.text,
                bigText = this.props.data.bigText,
                visible = this.state.visible;


            return (
                <div className="article">
                    <p className="news__author">{author}:</p>
                    <p className="news__text">{text}</p>
                    <a href="#" onClick={this.readmoreClick} className={'news__readmore ' + (visible ? 'none' : '')}>Подробнее</a>
                    <p className={'news__big-text ' + (visible ? '' : 'none')}>{bigText}</p>
                </div>
            )
        }
});


var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return {
            counter: 0
        }
    },
    render: function () {
        var data = this.props.data;
        var newsTemplate;

        if (data.length > 0) {
            newsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                )
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }

        return (
            <div className='news'>
                {newsTemplate}
                <strong className={'news__count ' + (data.length > 0 ? '' : 'none')}>Всего
                    новостей: {data.length}</strong>
            </div>
        );
    }
});

var Add = React.createClass({
    getInitialState: function() { //устанавливаем начальное состояние (state)
        return {
            btnIsDisabled: true,
            autorIsCLear: true,
            textIsClear:true,
            bigTextIsClear:true,
        };
    },
    componentDidMount: function() {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },

    onAuthorChange: function(e) {
       if (e.target.value.trim().length > 0) {
             this.setState({autorIsCLear: false});
       } else {
             this.setState({autorIsCLear: true});
       }
    },
    onTextChange: function(e) {
        if (e.target.value.trim().length > 0) {
            this.setState({textIsClear: false});
        } else {
            this.setState({textIsClear: true});
        }
    },
    onBigTextChange: function(e) {
        if (e.target.value.trim().length > 0) {
            this.setState({bigTextIsClear: false});
        } else {
            this.setState({bigTextIsClear: true});
        }
    },
    onBtnClickHandler: function(e) {
        e.preventDefault();
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = ReactDOM.findDOMNode(this.refs.text);
        var bigText = ReactDOM.findDOMNode(this.refs.bigText);
        var item = [{
            author: author,
            text: text.value,
            bigText: bigText.value
        }];
        window.ee.emit('News.add', item);

        text.value='';
        bigText.value='';
        this.setState({textIsClear: true});
        this.setState({bigTextIsClear: true});
    },
    onCheckRuleClick: function(e) {
        this.setState({btnIsDisabled: !this.state.btnIsDisabled}); //устанавливаем значение в state
    },

    render: function() {
        var btnIsDisabled = this.state.btnIsDisabled,
            autorIsCLear = this.state.autorIsCLear,
            textIsClear = this.state.textIsClear,
            bigTextIsClear = this.state.bigTextIsClear;

        return (
            <form className='add cf'>
                <input
                    type='text'
                    className='add__author'
                    onChange={this.onAuthorChange}
                    placeholder='Ваше имя'
                    ref='author'
                />
                <textarea
                    className='add__text'
                    onChange={this.onTextChange}
                    placeholder='Анонс новости'
                    ref='text'
                ></textarea>
                <textarea
                    className='add__bigText'
                    onChange={this.onBigTextChange}
                    placeholder='Текст новости'
                    ref='bigText'
                ></textarea>
                <label className='add__checkrule'>
                    <input type='checkbox' ref='checkrule' onChange={this.onCheckRuleClick}/>Я согласен с правилами
                </label>

                {/* берем значение для disabled атрибута из state */}
                <button
                    className='add__btn'
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={ btnIsDisabled || autorIsCLear || textIsClear || bigTextIsClear}
                >
                    Добавить новость
                </button>
            </form>
        );
    }
});



var App = React.createClass({

    getInitialState: function() {
        return {
            news: my_news
        };
    },
    componentDidMount: function() {
        var self = this;
        window.ee.addListener('News.add', function(item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },
    componentWillUnmount: function() {
        window.ee.removeListener('News.add');
    },
    render: function () {
        return (
            <div className="app">
                <Add/>
                <h3>Новости</h3>
                <News data={this.state.news}/>

            </div>
        );
    }
});


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
