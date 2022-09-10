import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { relativeDate } from '../helpers/relativeDate';

function IssueItem({
  key,
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) {
  return (
  <li>
    <div>
      {status === 'done' || status === 'cancelled'
        ? <GoIssueClosed style={{color: 'red'}} />
        : <GoIssueOpened style={{color: 'green'}} />
      }
    </div>
    <div className="issue-content">
      <span>
        <Link to={`/issue/${number}`}>{title}</Link>
        {labels.map((label) => (
          <span key={label} className={`label red`}>{label}</span>
        ))}
      </span>
      <small>
        #{number} opened {relativeDate(createdDate)} by {createdBy} 
      </small>
    </div>
    {assignee ? <div>{assignee}</div> : null}
    <span className="comment-count">
      {commentCount > 0 ? (
        <>
          <GoComment />
          {commentCount}
        </>
      ) : null}
    </span>
  </li>
)}

export default function IssuesList() {
  const issuesQuery = useQuery(
    ['issues'],
    () => fetch(`/api/issues`).then(response => response.json())
  )
  return (
    <div>
      <h1>Issues List</h1>
      {issuesQuery.isLoading ?
      <p>Loading...</p> :
      <ul className="issues-list">
        {issuesQuery.data.map((issue) => <IssueItem
          key={issue.id}
          title={issue.title}
          number={issue.number}
          assignee={issue.assignee}
          commentCount={issue.comments.length}
          createdBy={issue.createdBy}
          createdDate={issue.createdDate}
          labels={issue.labels}
          status={issue.status}
        />)}
      </ul>}
    </div>
  );
}
