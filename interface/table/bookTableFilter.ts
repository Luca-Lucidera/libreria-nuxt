import IFilter from '~~/interface/filter';
export default interface IBookTableFilter {
  type: IFilter[];
  status: IFilter[];
  editor: IFilter[];
}