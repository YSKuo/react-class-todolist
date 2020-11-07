import React, {Component} from 'react';
import 'normalize.css';
import '../styles/styles.scss';

const CheckBox = ({ id, checked, onChange }) => (
  <div>
    <input 
      id={id}
      type="checkbox"
      name="isFollowed"
      value={id}
      checked={checked} 
      onChange={onChange}
    />
    <label htmlFor={id}>關注此職缺</label>
  </div>
);

const Job = ({ title, content, salary, link, follow, handleCheckboxChange }) => (
  <div key={link} className={follow.indexOf(link) >= 0 ? 'job followed' : 'job'}>
    <h2>{title}</h2>
    <p className='job__content'>{content}</p>
    <p>薪水範圍：{salary}</p>
    <a href={link} target="_blank">我要應徵</a>
    <CheckBox 
      id={link}
      checked={follow.indexOf(link) >= 0}
      onChange={handleCheckboxChange}
    />
  </div>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jobs: [],
      type: 'all',
      follow: [],
      keyWord: ''
    }
  };

  componentDidMount() {
    fetch('http://www.mocky.io/v2/5c18f4ac2f00002a00af130a')
      .then(res => res.json())
      .then(data => {
        this.setState({
          jobs: data
        })
      })
    try {
      const json = localStorage.getItem('follow');
      const follow = JSON.parse(json);
      if (follow) {
        this.setState({
          follow
        })
      }
    } catch (e) {}
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.follow.length !== this.state.follow.length) {
      const json = JSON.stringify(this.state.follow);
      localStorage.setItem('follow', json);
    }
  }

  // filter
  handleTypeChange = (e) => {
    this.setState({ type: e.target.value });
  };

  // 關注功能
  // 配合 componentDidMount 及 componentDidUpdate 使得關注的內容儲存在本機
  handleCheckboxChange = (e) => {
    const { follow } = this.state;
    const value = e.target.value;
    const newFollow = follow.filter(item => item !== value);

    if (follow.length !== newFollow.length) {
      this.setState({
        follow: newFollow
      })
    } else {
      this.setState({
        follow: [...follow, value]
      })
    }
  };

  // 搜尋功能，只要在輸入框寫入關鍵字，畫面自動篩選符合條件的內容
  handleOnSearch = (e) => {
    const value = e.target.value;
    this.setState({ keyWord: value })
  };

  render() {
    const { jobs, type, follow, keyWord } = this.state;
    return (
      <div className="App">
        <h1>Job board 職缺報報</h1>
        類型：<select name="type" value={type} onChange={this.handleTypeChange}>
          <option value="all">全部</option>
          <option value="front">前端</option>
          <option value="back">後端</option>
          <option value="other">其他</option>
        </select>
        <input 
          name="search"
          value={keyWord}
          onChange={this.handleOnSearch}
        />
        <div className="jobs">
          {
            jobs
              .filter(job => {
                switch (type) {
                  case 'all':
                    return true
                  case 'front':
                    return (job.title.includes('前端') || job.title.toLowerCase().includes('frontend'));
                  case 'back':
                    return (job.title.includes('後端') || job.title.toLowerCase().includes('backend'));
                  case 'other':
                    return !(job.title.includes('前端') || job.title.toLowerCase().includes('frontend') || job.title.includes('後端') || job.title.toLowerCase().includes('backend'));
                }
              })
              .filter(job => job.title.toLowerCase().includes(keyWord))
              .map(job => (
              <Job 
                key={job.link}
                title={job.title}
                content={job.content}
                salary={job.salary}
                link={job.link}
                follow={follow}
                handleCheckboxChange={this.handleCheckboxChange}
              />
            ))
          }
        </div>
      </div>
    )
  }
}

export default App
