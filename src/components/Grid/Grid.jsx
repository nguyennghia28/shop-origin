import * as React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import {
    DataGrid,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
    GridToolbarColumnsButton,
    GridToolbarExport,
    gridPageCountSelector,
    gridPageSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';
import { createTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';

function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

const defaultTheme = createTheme();
const useStyles = makeStyles(
    (theme) => ({
        root: {
            padding: theme.spacing(0.5, 0.5, 0),
            justifyContent: 'space-between',
            display: 'flex',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
        },
        textField: {
            [theme.breakpoints.down('xs')]: {
                width: '100%',
            },
            margin: theme.spacing(1, 0.5, 1.5),
            '& .MuiSvgIcon-root': {
                marginRight: theme.spacing(0.5),
            },
            '& .MuiInput-underline:before': {
                borderBottom: `1px solid ${theme.palette.divider}`,
            },
        },
    }),
    { defaultTheme },
);

function QuickSearchToolbar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <div>
                <GridToolbarColumnsButton />
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
                <GridToolbarExport />
            </div>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder="Nhập từ khóa tìm kiếm…"
                className={classes.textField}
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small" />,
                    endAdornment: (
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            style={{ visibility: props.value ? 'visible' : 'hidden' }}
                            onClick={props.clearSearch}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    ),
                }}
            />
        </div>
    );
}

QuickSearchToolbar.propTypes = {
    clearSearch: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string.isRequired,
};

function Grid({ headers, datas, rowHeight, pagesize, hideToolbar }) {
    const [searchText, setSearchText] = React.useState('');
    const [rows, setRows] = React.useState(datas);

    const requestSearch = (searchValue) => {
        setSearchText(searchValue);
        const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
        const filteredRows = datas.filter((row) => {
            return Object.keys(row).some((field) => {
                return searchRegex.test(row[field].toString());
            });
        });
        setRows(filteredRows);
    };

    React.useEffect(() => {
        setRows(datas);
    }, [datas]);

    // console.log(datas);

    const localizedTextsMap = {
        // Root
        noRowsLabel: 'Không có dữ liệu',
        noResultsOverlayLabel: 'Không tìm thấy kết quả.',

        // Density selector toolbar button text
        toolbarDensity: 'Độ giãn',
        toolbarDensityLabel: 'Độ giãn',
        toolbarDensityCompact: 'Trung bình',
        toolbarDensityStandard: 'Tiêu chuẩn',
        toolbarDensityComfortable: 'Rộng',

        // Columns selector toolbar button text
        toolbarColumns: 'Cột',
        toolbarColumnsLabel: 'Chọn cột',

        // Filters toolbar button text
        toolbarFilters: 'Bộ lọc',
        toolbarFiltersLabel: 'Hiển thị bộ lọc',
        toolbarFiltersTooltipHide: 'Ẩn',
        toolbarFiltersTooltipShow: 'Hiện',
        toolbarFiltersTooltipActive: (count) => (count > 1 ? `${count} bộ lọc hoạt động` : `${count} bộ lọc hoạt động`),

        // Quick filter toolbar field
        toolbarQuickFilterPlaceholder: 'Tìm kiếm…',
        toolbarQuickFilterLabel: 'Tìm kiếm',
        toolbarQuickFilterDeleteIconLabel: 'Xóa tìm kiếm',

        // Export selector toolbar button text
        toolbarExport: 'Xuất',
        toolbarExportLabel: 'Xuất',
        toolbarExportCSV: 'Xuất CSV',
        toolbarExportPrint: 'In',
        toolbarExportExcel: 'Xuất Excel',

        // Columns panel text
        columnsPanelTextFieldLabel: 'Tìm kiếm',
        columnsPanelTextFieldPlaceholder: 'Tiêu đề cột',
        columnsPanelDragIconLabel: 'Sắp xếp',
        columnsPanelShowAllButton: 'Hiện tất cả',
        columnsPanelHideAllButton: 'Ẩn tất cả',

        // Filter panel text
        filterPanelAddFilter: 'Thêm bộ lọc',
        // filterPanelRemoveAll: 'Remove all',
        filterPanelDeleteIconLabel: 'Xóa',
        filterPanelLogicOperator: 'Toán tử logic',
        filterPanelOperator: 'Toán tử',
        filterPanelOperatorAnd: 'Và',
        filterPanelOperatorOr: 'Hoặc',
        filterPanelColumns: 'Cột',
        filterPanelInputLabel: 'Giá trị',
        filterPanelInputPlaceholder: 'Lọc giá trị',

        // Filter operators text
        filterOperatorContains: 'Chứa',
        filterOperatorEquals: 'Bằng',
        filterOperatorStartsWith: 'Bắt đầu bằng',
        filterOperatorEndsWith: 'Kết thúc bằng',
        filterOperatorIs: 'Là',
        filterOperatorNot: 'Không là',
        filterOperatorAfter: 'Trước',
        filterOperatorOnOrAfter: 'Bằng hoặc sau',
        filterOperatorBefore: 'Sau',
        filterOperatorOnOrBefore: 'Bằng hoặc trước',
        filterOperatorIsEmpty: 'Rỗng',
        filterOperatorIsNotEmpty: 'Khác rỗng',
        filterOperatorIsAnyOf: 'Là bất kỳ của',

        // Filter values text
        filterValueAny: 'Bất kỳ giá trị nào',
        filterValueTrue: 'Có',
        filterValueFalse: 'Không',

        // Column menu text
        columnMenuLabel: 'Danh mục',
        columnMenuShowColumns: 'Danh sách cột',
        columnMenuManageColumns: 'Cột',
        columnMenuFilter: 'Bộ lọc',
        columnMenuHideColumn: 'Ẩn cột',
        columnMenuUnsort: 'Bỏ sắp xếp',
        columnMenuSortAsc: 'Sắp xếp tăng dần',
        columnMenuSortDesc: 'Sắp xếp giảm dần',

        // Column header text
        columnHeaderFiltersTooltipActive: (count) =>
            count > 1 ? `${count} bộ lọc hoạt động` : `${count} bộ lọc hoạt động`,
        columnHeaderFiltersLabel: 'Bộ lọc',
        columnHeaderSortIconLabel: 'Sắp xếp',

        // Rows selected footer text
        footerRowSelected: (count) =>
            count > 1 ? `${count.toLocaleString()} hàng đã chọn` : `${count.toLocaleString()} hàng đã chọn`,

        // Total row amount footer text
        footerTotalRows: 'Tổng:',

        // Total visible row amount footer text
        footerTotalVisibleRows: (visibleCount, totalCount) =>
            `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

        // Checkbox selection text
        checkboxSelectionHeaderName: 'Tích vào ô trống',
        checkboxSelectionSelectAllRows: 'Chọn tất cả hàng',
        checkboxSelectionUnselectAllRows: 'Bỏ chọn tất cả hàng',
        checkboxSelectionSelectRow: 'Chọn hàng',
        checkboxSelectionUnselectRow: 'Bỏ chọn hàng',

        // Boolean cell text
        booleanCellTrueLabel: 'Có',
        booleanCellFalseLabel: 'Không',

        // Actions cell more text
        actionsCellMore: 'Thêm',

        // Column pinning text
        pinToLeft: 'Ghim cột bên trái',
        pinToRight: 'Ghim cột bên phải',
        unpin: 'Bỏ ghim',

        // Tree Data
        treeDataGroupingHeaderName: 'Nhóm',
        treeDataExpand: 'Mở rộng',
        treeDataCollapse: 'Ẩn đi',

        // Grouping columns
        groupingColumnHeaderName: 'Nhóm',
        groupColumn: (name) => `Nhóm theo ${name}`,
        unGroupColumn: (name) => `Hủy nhóm theo ${name}`,

        // Master/detail
        detailPanelToggle: 'Ẩn/hiện chi tiết',
        expandDetailPanel: 'Mở rộng',
        collapseDetailPanel: 'Thu nhỏ',

        // Row reordering text
        rowReorderingHeaderName: 'Sắp xếp hàng',

        // Aggregation
        // aggregationMenuItemHeader: 'Aggregation',
        // aggregationFunctionLabelSum: 'sum',
        // aggregationFunctionLabelAvg: 'avg',
        // aggregationFunctionLabelMin: 'min',
        // aggregationFunctionLabelMax: 'max',
        // aggregationFunctionLabelSize: 'size',
    };

    const PAGE_SIZE = pagesize;

    function CustomPagination() {
        const apiRef = useGridApiContext();
        const page = useGridSelector(apiRef, gridPageSelector);
        const pageCount = useGridSelector(apiRef, gridPageCountSelector);

        return (
            <Pagination
                color="primary"
                variant="outlined"
                shape="rounded"
                page={page + 1}
                count={pageCount}
                // @ts-expect-error
                renderItem={(props2) => <PaginationItem {...props2} disableRipple />}
                onChange={(event, value) => apiRef.current.setPage(value - 1)}
            />
        );
    }

    const [paginationModel, setPaginationModel] = React.useState({
        pageSize: PAGE_SIZE,
        page: 0,
    });

    return (
        <>
            {!hideToolbar ? (
                <DataGrid
                    // components={{ Toolbar: QuickSearchToolbar }}
                    rows={rows}
                    columns={headers}
                    componentsProps={{
                        toolbar: {
                            value: searchText,
                            onChange: (event) => requestSearch(event.target.value),
                            clearSearch: () => requestSearch(''),
                        },
                    }}
                    getRowId={(row) => row._id}
                    // disableRowSelectionOnClick
                    disableColumnResize
                    // pagination
                    // autoPageSize={true}
                    rowHeight={rowHeight}
                    localeText={localizedTextsMap}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[PAGE_SIZE]}
                    slots={{
                        pagination: CustomPagination,
                        toolbar: QuickSearchToolbar,
                    }}
                    sx={{
                        width: '100%',
                        '& .super-app-theme--header': {
                            color: 'black',
                            backgroundColor: 'rgba(0,0,0,.1)',
                            fontSize: 16,
                        },
                        '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                            borderRight: `1px solid rgba(0,0,0,.1)`,
                        },
                    }}
                />
            ) : (
                <DataGrid
                    // components={{ Toolbar: QuickSearchToolbar }}
                    rows={rows}
                    columns={headers}
                    componentsProps={{
                        toolbar: {
                            value: searchText,
                            onChange: (event) => requestSearch(event.target.value),
                            clearSearch: () => requestSearch(''),
                        },
                    }}
                    getRowId={(row) => row._id}
                    // disableRowSelectionOnClick
                    disableColumnResize
                    // pagination
                    // autoPageSize={true}
                    rowHeight={rowHeight}
                    localeText={localizedTextsMap}
                    paginationModel={paginationModel}
                    onPaginationModelChange={setPaginationModel}
                    pageSizeOptions={[PAGE_SIZE]}
                    slots={{
                        pagination: CustomPagination,
                    }}
                    sx={{
                        width: '100%',
                        '& .super-app-theme--header': {
                            color: 'black',
                            backgroundColor: 'rgba(0,0,0,.1)',
                            fontSize: 16,
                        },
                        '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                            borderRight: `1px solid rgba(0,0,0,.1)`,
                        },
                    }}
                />
            )}
        </>
    );
}

export default Grid;
